'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { parse } from 'path';


type OddsTableType = Record<number, Record<number, number>>;
const ODDS_TABLE: OddsTableType  = {
  2: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
  3: { 1: 75, 2: 25, 3: 0, 4: 0, 5: 0 },
  4: { 1: 55, 2: 30, 3: 15, 4: 0, 5: 0 },
  5: { 1: 45, 2: 33, 3: 20, 4: 2, 5: 0 },
  6: { 1: 30, 2: 40, 3: 25, 4: 5, 5: 0 },
  7: { 1: 20, 2: 33, 3: 36, 4: 10, 5: 1 },
  8: { 1: 18, 2: 27, 3: 32, 4: 20, 5: 3 },
  9: { 1: 15, 2: 20, 3: 25, 4: 30, 5: 10 },
  10: { 1: 5, 2: 10, 3: 20, 4: 40, 5: 25 },
  11: { 1: 1, 2: 2, 3: 12, 4: 50, 5: 35 }
};

const CHAMPIONS_POOL: Record<number, number> = {
  1: 22,
  2: 20,
  3: 17,
  4: 10,
  5: 9
};

const LEVELS = [3, 4, 5, 6, 7, 8, 9, 10, 11];
const TIERS = [1, 2, 3, 4, 5];

const TIER_STYLES: Record<number, string> = {
  1: 'bg-gray-300',    // Common
  2: 'bg-green-300',   // Uncommon
  3: 'bg-blue-300',    // Rare
  4: 'bg-purple-300',  // Epic
  5: 'bg-orange-300'   // Legendary
};
const TIER_COLORS: Record<number, string> = {
  1: 'gray',    // Common
  2: 'green',   // Uncommon
  3: 'blue',    // Rare
  4: 'purple',  // Epic
  5: 'orange'   // Legendary
};

const TFTCalculator = () => {
  const [level, setLevel] = useState("3");
  const [tier, setTier] = useState("");
  const [gold, setGold] = useState("50");
  const [unitsOut, setUnitsOut] = useState('0');
  const [totalUnitsOut, setTotalUnitsOut] = useState('0');
  const [chance, setChance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const parsedGold = parseInt(gold, 10);
    const parsedUnitsOut = parseInt(unitsOut, 10);
    const parsedTotalUnitsOut = parseInt(totalUnitsOut, 10);
    const parsedTier = parseInt(tier, 10);
    const poolSize = CHAMPIONS_POOL[parsedTier];

    if (!isNaN(parsedGold) && parsedGold >= 2 && !isNaN(parsedUnitsOut) && !isNaN(parsedTotalUnitsOut)) {
      const rolls = Math.floor(parsedGold / 2);
      const odds = ODDS_TABLE[parseInt(level)][parsedTier];
      const availableUnits = poolSize - parsedUnitsOut;
      const totalUnits = poolSize * 13 - parsedTotalUnitsOut;
      const unitChance = (odds / 100) * (availableUnits / totalUnits);
      const result = 1 - Math.pow((1 - unitChance), rolls);
      result < 0 ? setChance(0) : setChance(result * 100);
      console.log("if", result, chance)
      setError(null);
    } else {
      console.log("else")
      setChance(null);
      setError("Fill out all fields with valid numbers.");
    }
  }

  const handleSelectLevelChange = (value: string) => {
    setLevel(value);
  }

  const handleSelectTierChange = (value: string) => {
    setTier(value);
  }

  const tierColorStyle = TIER_STYLES[parseInt(tier)];

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-md w-full p-5 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold">TFT Roll Calculator</h2>
        </CardHeader>
        <CardContent className='grid gap-4 mb-4 w-full max-w-md'>
          <Label htmlFor="level">Select your level</Label>
          <Select onValueChange={handleSelectLevelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>

            {LEVELS.map((lvl) => (
              <SelectItem key={lvl} value={lvl.toString()}>
                Level {lvl}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>

          <Label htmlFor="level">Tier of desired unit to hit</Label>
          <Select onValueChange={handleSelectTierChange}>
          <SelectTrigger className={tierColorStyle}>
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>

            {TIERS.map((tier) => (
              <SelectItem key={tier} value={tier.toString()}  style={{color: TIER_COLORS[(tier)], fontWeight: 500}}>
                Tier {tier}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>


          <Label htmlFor="gold">Enter your gold</Label>
          <Input
            id="gold"
            placeholder="Gold"
            value={gold}
            onChange={(e) => setGold(e.target.value)}
            className="mb-2"
          />

          <div className="mb-4">
            <Label htmlFor="units-out">Total units of desired champion already taken</Label>
            <Input
              max={CHAMPIONS_POOL[parseInt(tier)] ?? 22}
              id="units-out"
              placeholder="Units out"
              value={unitsOut}
              onChange={(e) => setUnitsOut(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="total-units-out">Total {tier ? tier : "X"} cost units out of the pool</Label>
            <Input
              max={CHAMPIONS_POOL[parseInt(tier)]*13 ?? 22}
              id="total-units-out"
              placeholder={`Total ${tier ? tier : "X"} cost units out`}
              value={totalUnitsOut}
              onChange={(e) => setTotalUnitsOut(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button onClick={handleCalculate} className="w-full">Calculate</Button>
        </CardContent>
          <CardFooter>
            <div className="text-xl">
              {(error === null && chance !== null) ? 
                `Chance to hit a desired unit: ${chance.toFixed(2)}%` 
                : error 
              }
            </div>
          </CardFooter>
      </Card>
    </div>
  );
}

export default TFTCalculator;