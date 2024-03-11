export interface UserInterface {
  email: string;
  config?: {
    nas: {
      protocol: "http" | "https";
      host: string;
      port: number;
      user: string;
      pwd: string;
    };
  };
}
