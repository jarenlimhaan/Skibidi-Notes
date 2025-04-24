import type { NextConfig } from "next";
const { config } = require('dotenv');
const path = require('path');

config({ path: path.resolve(__dirname, '../.env') });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
