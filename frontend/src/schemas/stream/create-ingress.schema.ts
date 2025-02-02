import {z} from "zod";

export enum IngressType {
	RTMP ,
	WHIP
}

export const createIngressSchema = z.object({
    ingressType: z.nativeEnum(IngressType),
})


export type TypeCreateIngressSchema = z.infer<typeof createIngressSchema>
