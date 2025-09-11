export const isSelfHosted = process.env.SELFHOSTED === "true";
export const isHosted = !isSelfHosted;
