
// Solscan API Integration
// Documentation: https://public-api.solscan.io/docs/

const SOLSCAN_BASE_URL = 'https://api.solscan.io'; // Updated base URL
const SOLSCAN_PUBLIC_URL = 'https://public-api.solscan.io'; // Keep public API as fallback

// Configuration options
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second between retries
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDc5MTEyMTU3MzcsImVtYWlsIjoicmhhdy5kZXZAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQ3OTExMjE1fQ.UQPzzuDxNNubQfrc50WBEZCcDAzzqGDSGSCrrPyBERc'; // Solscan API key

// Helper function to implement retry logic
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If rate limited or server error, retry with exponential backoff
    if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
      if (retries > 0) {
        console.log(`Solscan API returned ${response.status}, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
        return fetchWithRetry(url, options, retries - 1);
      }
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Solscan API fetch failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// Function to get appropriate headers
function getHeaders() {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }
  
  return headers;
}

// Try both API endpoints to increase chances of success
async function tryMultipleEndpoints(paths: string[], params: string = ''): Promise<any> {
  // Try all combinations of base URLs and paths
  const urls = [];
  
  // First try the updated API with both paths
  for (const path of paths) {
    urls.push(`${SOLSCAN_BASE_URL}${path}${params}`);
  }
  
  // Then try the public API with both paths
  for (const path of paths) {
    urls.push(`${SOLSCAN_PUBLIC_URL}${path}${params}`);
  }
  
  let lastError: Error | null = null;
  
  for (const url of urls) {
    try {
      console.log(`Trying Solscan endpoint: ${url}`);
      const response = await fetchWithRetry(url, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      console.warn(`Endpoint ${url} returned status: ${response.status}`);
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      lastError = error as Error;
    }
  }
  
  throw lastError || new Error("All Solscan API endpoints failed");
}

// Function to get account details
export async function getAccountDetails(address: string) {
  try {
    return await tryMultipleEndpoints([
      `/account/${address}`,
      `/v1/account/${address}`
    ]);
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw error;
  }
}

// Function to get token metadata
export async function getTokenMetadata(tokenAddress: string) {
  try {
    return await tryMultipleEndpoints([
      `/token/meta`,
      `/v1/token/meta`
    ], `?tokenAddress=${tokenAddress}`);
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
}

// Function to get token holders
export async function getTokenHolders(tokenAddress: string, limit: number = 10, offset: number = 0) {
  try {
    return await tryMultipleEndpoints([
      `/token/holders`,
      `/v1/token/holders`
    ], `?tokenAddress=${tokenAddress}&limit=${limit}&offset=${offset}`);
  } catch (error) {
    console.error('Error fetching token holders:', error);
    throw error;
  }
}

// Function to get token price information
export async function getTokenPrice(tokenAddress: string) {
  try {
    return await tryMultipleEndpoints([
      `/token/price`,
      `/v1/token/price`
    ], `?tokenAddress=${tokenAddress}`);
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
}

// Function to get account transactions
export async function getAccountTransactions(address: string, limit: number = 10, before: number = 0) {
  try {
    let params = `?account=${address}&limit=${limit}`;
    if (before > 0) {
      params += `&before=${before}`;
    }
    
    return await tryMultipleEndpoints([
      `/account/transactions`,
      `/v1/account/transactions`
    ], params);
  } catch (error) {
    console.error('Error fetching account transactions:', error);
    throw error;
  }
}

// Function to get token transactions
export async function getTokenTransactions(tokenAddress: string, limit: number = 10, offset: number = 0) {
  try {
    return await tryMultipleEndpoints([
      `/token/txs`,
      `/v1/token/txs`
    ], `?tokenAddress=${tokenAddress}&limit=${limit}&offset=${offset}`);
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    throw error;
  }
}
