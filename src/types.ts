export interface CouponSubmission {
  nom: string;
  prenom: string;
  email: string;
  typeCoupon: string;
  autreCouponText: string;
  codeCoupon: string;
  cacherCode: "OUI" | "NON";
  imageBase64: string;
  imageFilename: string;
}

export interface ContactSubmission {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export type ActivePage = "accueil" | "verification" | "contact";
