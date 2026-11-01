"use client";

import * as React from "react";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";

import { useI18n } from "@/components/i18n";
import { MAP_CENTER, mappedStores, type Store } from "@/data/stores";

type L = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletMarker = import("leaflet").Marker;
type ClusterGroup = import("leaflet").MarkerClusterGroup;

/**
 * OpenStreetMap's own tiles: free, no key, no sign-up.
 *
 * This used to be CARTO, which stopped serving its basemaps without an API
 * key — every tile came back stamped "API KEY REQUIRED" across the map. OSM
 * only publishes one colourway, so the dark map is made by filtering these in
 * CSS (see `.hv-map` in globals.css) rather than by swapping the URL.
 */
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** A honeycomb pin in the brand's gold, drawn as markup so it themes itself. */
function pinHtml(): string {
  return `<span class="hv-pin"><svg viewBox="0 0 30 38" aria-hidden>
    <path d="M15 37C15 37 28 22.5 28 14A13 13 0 0 0 2 14c0 8.5 13 23 13 23z" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/>
    <path d="M15 7.5 21 11v7l-6 3.5L9 18v-7z" fill="none" stroke="var(--bg)" stroke-width="1.8" stroke-linejoin="round"/>
  </svg></span>`;
}

function popupHtml(store: Store, labels: { hours: string; unknown: string }): string {
  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const hours = store.hours
    ? `<p class="hv-pop-h">${esc(labels.hours)}</p><ul class="hv-pop-ul">${store.hours
        .map((h) => `<li>${esc(h)}</li>`)
        .join("")}</ul>`
    : `<p class="hv-pop-note">${esc(labels.unknown)}</p>`;
  return `<div class="hv-pop">
    <h3>${esc(store.name)}</h3>
    <p class="hv-pop-addr">${esc(store.address)}<br/>${esc(store.postcode)} ${esc(store.town)}</p>
    ${hours}
  </div>`;
}

/**
 * The stockist map.
 *
 * Leaflet is loaded in the browser only (this is a static export, so there is
 * no server to render it on), the pins are clustered until you zoom in, and
 * the view is fitted to every shop we could place. Tapping a pin opens the
 * shop's name, address and hours; `focus` lets the list beside the map fly to
 * a shop, which is why the map is driven by props rather than owning state.
 */
export function StoreMap({
  focus,
  onReady,
}: {
  /** Store id the list asked to fly to, plus a nonce so repeats still fire. */
  focus?: { id: string; at: number } | null;
  onReady?: () => void;
}) {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const tileRef = React.useRef<import("leaflet").TileLayer | null>(null);
  const markersRef = React.useRef<Map<string, LeafletMarker>>(new Map());
  const clusterRef = React.useRef<ClusterGroup | null>(null);
  const [failed, setFailed] = React.useState(false);

  // Build the map once.
  React.useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    (async () => {
      try {
        // Take the CommonJS export, not the ES namespace: the markercluster
        // plugin bolts `markerClusterGroup` onto that object at load time, and
        // a namespace's named exports are fixed before the plugin ever runs.
        const mod = await import("leaflet");
        const leaflet = ((mod as { default?: unknown }).default ?? mod) as L;
        await import("leaflet.markercluster");
        if (cancelled || !containerRef.current) return;

        map = leaflet.map(containerRef.current, {
          center: MAP_CENTER,
          zoom: 9,
          scrollWheelZoom: false, // never steal a page scroll
          zoomControl: true,
          attributionControl: true,
        });
        mapRef.current = map;

        // The current zoom, on the element itself. Leaflet keeps it inside a
        // closure, and reading it back from tile URLs means waiting on a tile
        // server — which made the zoom test fail whenever the network was
        // busy rather than when the map was broken.
        const live = map;
        const showZoom = () => {
          live.getContainer().dataset.zoom = String(live.getZoom());
        };
        showZoom();
        live.on("zoomend", showZoom);

        tileRef.current = leaflet
          .tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 })
          .addTo(map);

        const cluster = leaflet.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 48,
          iconCreateFunction: (c) =>
            leaflet.divIcon({
              html: `<span class="hv-cluster">${c.getChildCount()}</span>`,
              className: "hv-cluster-wrap",
              iconSize: leaflet.point(38, 38),
            }),
        });
        clusterRef.current = cluster;

        const icon = leaflet.divIcon({
          html: pinHtml(),
          className: "hv-pin-wrap",
          iconSize: leaflet.point(30, 38),
          iconAnchor: leaflet.point(15, 37),
          popupAnchor: leaflet.point(0, -32),
        });

        for (const store of mappedStores) {
          const marker = leaflet
            .marker([store.lat, store.lng], { icon, title: store.name })
            .bindPopup(popupHtml(store, { hours: t.stores.hours, unknown: t.stores.hoursUnknown }));
          markersRef.current.set(store.id, marker);
          cluster.addLayer(marker);
        }
        map.addLayer(cluster);

        const bounds = leaflet.latLngBounds(mappedStores.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds, { padding: [48, 48] });

        onReady?.();
      } catch (error) {
        console.error("Stockist map could not start:", error);
        if (!cancelled) setFailed(true);
      }
    })();

    const markers = markersRef.current;
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markers.clear();
      clusterRef.current = null;
    };
    // The popup labels are read once, when the map is built; switching language
    // re-renders the page around it, which is enough for this map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to whatever the list asked for.
  React.useEffect(() => {
    if (!focus) return;
    const map = mapRef.current;
    const marker = markersRef.current.get(focus.id);
    if (!map || !marker) return;
    const go = () => {
      map.flyTo(marker.getLatLng(), 15, { duration: 0.9 });
      marker.openPopup();
    };
    // Unspiderfy first, or a clustered marker has no position to fly to.
    if (clusterRef.current) clusterRef.current.zoomToShowLayer(marker, go);
    else go();
  }, [focus]);

  if (failed) {
    return (
      <div className="grid h-full place-items-center rounded-[22px] border border-border bg-bg-soft p-8 text-center text-sm text-foreground-muted">
        {t.stores.listHeading}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={t.stores.mapLabel}
      className="hv-map h-[420px] w-full overflow-hidden rounded-[22px] border border-border md:h-[560px]"
    />
  );
}
