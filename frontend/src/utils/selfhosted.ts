export const isSelfHosted = process.env.SELFHOSTED === "true";
export const isHosted = !isSelfHosted;

console.log("isSelfHosted:", isSelfHosted);
console.log("isHosted:", isHosted);
console.log("SELFHOSTED:", process.env.SELFHOSTED);
