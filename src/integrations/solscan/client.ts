
// Solscan API Integration
// Documentation: https://public-api.solscan.io/docs/

const SOLSCAN_BASE_URL = 'https://public-api.solscan.io';

// Function to get account details
export async function getAccountDetails(address: string) {
  try {
    const response = await fetch(`${SOLSCAN_BASE_URL}/account/${address}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw error;
  }
}

// Function to get token metadata
export async function getTokenMetadata(tokenAddress: string) {
  try {
    const response = await fetch(`${SOLSCAN_BASE_URL}/token/meta?tokenAddress=${tokenAddress}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
}

// Function to get token holders
export async function getTokenHolders(tokenAddress: string, limit: number = 10, offset: number = 0) {
  try {
    const response = await fetch(
      `${SOLSCAN_BASE_URL}/token/holders?tokenAddress=${tokenAddress}&limit=${limit}&offset=${offset}`, 
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token holders:', error);
    throw error;
  }
}

// Function to get token price information
export async function getTokenPrice(tokenAddress: string) {
  try {
    const response = await fetch(`${SOLSCAN_BASE_URL}/token/price?tokenAddress=${tokenAddress}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
}

// Function to get account transactions
export async function getAccountTransactions(address: string, limit: number = 10, before: number = 0) {
  try {
    let url = `${SOLSCAN_BASE_URL}/account/transactions?account=${address}&limit=${limit}`;
    if (before > 0) {
      url += `&before=${before}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching account transactions:', error);
    throw error;
  }
}

// Function to get token transactions
export async function getTokenTransactions(tokenAddress: string, limit: number = 10, offset: number = 0) {
  try {
    const response = await fetch(
      `${SOLSCAN_BASE_URL}/token/txs?tokenAddress=${tokenAddress}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    throw error;
  }
}
