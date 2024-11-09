'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'

interface Asset {
  symbol: string
  balance: number
  usdValue: number
  priceChange24h: number
}

interface AssetsListProps {
  assets: Asset[]
}

export default function AssetsList({ assets }: AssetsListProps) {
  return (
    <Card className="mt-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">الأصول</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرمز</TableHead>
                <TableHead className="text-left">الرصيد</TableHead>
                <TableHead className="text-left">القيمة بالدولار</TableHead>
                <TableHead className="text-left">التغير (24 ساعة)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.symbol}>
                  <TableCell className="font-medium">{asset.symbol}</TableCell>
                  <TableCell>{asset.balance.toLocaleString()}</TableCell>
                  <TableCell>${asset.usdValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {asset.priceChange24h > 0 && '+'}
                      {asset.priceChange24h.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}