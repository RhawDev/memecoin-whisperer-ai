
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TokenHolder {
  address: string;
  amount: string;
  percentage: number;
  rank: number;
  [key: string]: any;
}

interface TokenHoldersProps {
  tokenHolders: TokenHolder[];
}

const TokenHolders: React.FC<TokenHoldersProps> = ({ tokenHolders }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Top Token Holders</CardTitle>
      </CardHeader>
      <CardContent>
        {tokenHolders.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenHolders.map((holder, index) => (
                  <TableRow key={index} className="border-b border-white/10">
                    <TableCell>{holder.rank}</TableCell>
                    <TableCell>
                      <a 
                        href={`https://solscan.io/account/${holder.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        {holder.address.substring(0, 4)}...{holder.address.substring(holder.address.length - 4)}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">{Number(holder.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{holder.percentage.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">No holder data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenHolders;
