export type ShortcutKeys = "movies" | "series" | "games" | "softwares";

export interface UserInterface {
  email: string;
  config: {
    nas: {
      protocol: "http" | "https";
      host: string;
      port: number;
      login: string;
      password: string;
      shortcuts: { [k in ShortcutKeys]: string };
    };
    seedbox: {
      tag: string;
    };
  };
}
