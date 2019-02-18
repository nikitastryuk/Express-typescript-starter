export const checkEnv = (variables: string[]) => {
  const missing: string[] = [];

  variables.forEach(variable => {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length) {
    if (missing.length === 1) {
      throw new Error(`Missing environment variable: ${missing[0]}`);
    }
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
