import { Redis } from "@upstash/redis";

const QUEUE_KEY = "campaign_queue";

const getRedis = () => {
  const restUrl =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_URL ||
    process.env.REDIS_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_TOKEN ||
    process.env.REDIS_TOKEN;

  if (!restUrl) {
    throw new Error(
      "Missing Redis URL. Set UPSTASH_REDIS_REST_URL or REDIS_URL."
    );
  }

  if (!token) {
    throw new Error(
      "Missing Redis token. Set UPSTASH_REDIS_REST_TOKEN or REDIS_TOKEN."
    );
  }

  return new Redis({ url: restUrl, token });
};

export async function enqueueCampaign(campaignId: string) {
  const redis = getRedis();
  await redis.rpush(QUEUE_KEY, campaignId.trim());
  return true;
}

export async function dequeueCampaign(): Promise<{ campaignId: string } | null> {
  const redis = getRedis();
  const item = await redis.lpop(QUEUE_KEY);

  if (!item) {
    return null;
  }

  if (typeof item === "string") {
    const campaignId = item.trim();
    if (!campaignId) return null;
    return { campaignId };
  }

  if (typeof item === "object" && item && "campaignId" in item) {
    const campaignId = String((item as { campaignId?: unknown }).campaignId ?? "").trim();
    if (!campaignId) return null;
    return { campaignId };
  }

  const campaignId = String(item).trim();
  if (!campaignId) return null;
  return { campaignId };
}
