import { fetcher } from "@/lib/utils";
import { z } from "zod";

import { LoginSchema } from "@/schemas";

export const authLogin = async (formData: z.infer<typeof LoginSchema>) => {
  return await fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}