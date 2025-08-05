'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArbitrageService } from '@/services/arbitrageService';
import { ArbitrageOpportunity, ArbitrageConfig } from '@/types/arbitrage';
import { getNetworkConfig } from '@/config/defaultConfig';
import { NETWORK_CONFIGS_ENV } from '@/config/env';

export default function ArbitrageDashboard() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'polygon' | 'base'>('polygon'); // Default a Polygon per costi bassi
  const [config, setConfig] = useState<ArbitrageConfig>(getNetworkConfig('polygon'));
  const [arbitrageService, setArbitrageService] = useState<ArbitrageService | null>(null);
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    profitableOpportunities: 0,
    averageProfit: 0,
    totalProfit: 0
  });

  // Inizializza il servizio di arbitraggio
  useEffect(() => {
    const networkConfig = NETWORK_CONFIGS_ENV[selectedNetwork];
    const newConfig = getNetworkConfig(selectedNetwork);
    setConfig(newConfig);
    const service = new ArbitrageService(networkConfig.rpcUrl, newConfig);
    setArbitrageService(service);
  }, [selectedNetwork]);

  // Definizione della funzione updateStats con useCallback
  const updateStats = useCallback((opps: ArbitrageOpportunity[]) => {
    const profitable = opps.filter(opp => opp.profitability > config.minProfitThreshold);
    const avgProfit = profitable.length > 0 
      ? profitable.reduce((sum, opp) => sum + opp.profitability, 0) / profitable.length 
      : 0;

    setStats({
      totalOpportunities: opps.length,
      profitableOpportunities: profitable.length,
      averageProfit: avgProfit,
      totalProfit: profitable.reduce((sum, opp) => sum + opp.profitability, 0)
    });
  }, [config.minProfitThreshold]);

  // Monitora le opportunità
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring && arbitrageService) {
      interval = setInterval(async () => {
        try {
          const newOpportunities = await arbitrageService.monitorArbitrageOpportunities();
          setOpportunities(newOpportunities);
          updateStats(newOpportunities);
        } catch (error) {
          console.error('Error monitoring opportunities:', error);
        }
      }, 10000); // Controlla ogni 10 secondi
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, arbitrageService, updateStats]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const executeArbitrage = async (opportunity: ArbitrageOpportunity) => {
    if (!arbitrageService) return;

    try {
      // In un'implementazione reale, qui dovresti gestire il wallet dell'utente
      console.log('Executing arbitrage for opportunity:', opportunity.id);
      // const success = await arbitrageService.executeArbitrage(opportunity, wallet);
      
      // Per ora, simuliamo l'esecuzione
      opportunity.status = 'executing';
      setOpportunities([...opportunities]);
      
      setTimeout(() => {
        opportunity.status = Math.random() > 0.3 ? 'completed' : 'failed';
        setOpportunities([...opportunities]);
      }, 3000);
    } catch (error) {
      console.error('Error executing arbitrage:', error);
    }
  };

  const getNativeCurrency = (network: 'polygon' | 'base') => {
    const currencies = {
      polygon: 'POL',
      base: 'ETH'
    };
    return currencies[network];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      executing: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      executing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">DeFi Arbitrage Bot</h1>
        <div className="flex gap-4">
          <select 
            value={selectedNetwork} 
            onChange={(e) => setSelectedNetwork(e.target.value as 'polygon' | 'base')}
            className="px-3 py-2 border rounded-md"
          >
            <option value="polygon">Polygon</option>
            <option value="base">Base</option>
          </select>
          <Button 
            onClick={toggleMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profitable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.profitableOpportunities}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProfit.toFixed(2)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalProfit.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Adjust bot parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Profit Threshold (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.minProfitThreshold}
                onChange={(e) => setConfig({...config, minProfitThreshold: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Gas Price (gwei)</label>
              <input
                type="number"
                value={config.maxGasPrice}
                onChange={(e) => setConfig({...config, maxGasPrice: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slippage Tolerance (%)</label>
              <input
                type="number"
                step="0.01"
                value={config.slippageTolerance * 100}
                onChange={(e) => setConfig({...config, slippageTolerance: parseFloat(e.target.value) / 100})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Arbitrage Opportunities</CardTitle>
          <CardDescription>
            {isMonitoring ? 'Monitoring active - opportunities update every 10 seconds' : 'Start monitoring to see opportunities'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <Alert>
              <AlertDescription>
                {isMonitoring ? 'Scanning for opportunities...' : 'No opportunities found. Start monitoring to begin scanning.'}
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>DEX A</TableHead>
                  <TableHead>DEX B</TableHead>
                  <TableHead>Price Diff</TableHead>
                  <TableHead>Profit %</TableHead>
                  <TableHead>Gas Est.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell className="font-medium">
                      {opp.tokenA.symbol}/{opp.tokenB.symbol}
                    </TableCell>
                    <TableCell>{opp.dexA.name}</TableCell>
                    <TableCell>{opp.dexB.name}</TableCell>
                    <TableCell>{opp.priceDifference.toFixed(6)}</TableCell>
                    <TableCell className={opp.profitability > config.minProfitThreshold ? 'text-green-600 font-semibold' : ''}>
                      {opp.profitability.toFixed(2)}%
                    </TableCell>
                    <TableCell>{opp.gasEstimate.toFixed(4)} {getNativeCurrency(selectedNetwork)}</TableCell>
                    <TableCell>{getStatusBadge(opp.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => executeArbitrage(opp)}
                        disabled={opp.status === 'executing' || opp.profitability < config.minProfitThreshold}
                      >
                        Execute
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Footer */}
      <footer className="mt-12 py-4 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="font-semibold">Vision Technology</p>
          <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
