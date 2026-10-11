"use client";

import { createContext, useContext } from "react";

/**
 * What the dashboard knows about itself: whether it can publish to the live
 * site, and how an uploaded picture should be stored.
 */
export type AdminSession = {
  /** "live" — changes can go on the website. "local" — browser only. */
  mode: "live" | "local";
  /**
   * Stores an uploaded picture and returns its address. In live mode the
   * picture is uploaded to the site; otherwise it stays inside this browser.
   */
  storePicture: (dataUrl: string) => Promise<string>;
};

const AdminSessionContext = createContext<AdminSession>({
  mode: "local",
  storePicture: async (dataUrl) => dataUrl,
});

export const useAdminSession = () => useContext(AdminSessionContext);

export function AdminSessionProvider({
  value,
  children,
}: {
  value: AdminSession;
  children: React.ReactNode;
}) {
  return (
    <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>
  );
}
