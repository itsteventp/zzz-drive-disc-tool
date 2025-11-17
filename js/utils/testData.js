// ================================
// TEST DATA - Sample Characters & Discs
// ================================

import { createCharacter } from '../models/character.js';
import { createDisc } from '../models/disc.js';
import { saveCharacter, saveDisc } from '../storage/storage.js';

// ================================
// SAMPLE CHARACTERS
// ================================

export function createSampleCharacters() {
  const characters = [];
  
  // Character 1: DPS Attacker
  characters.push(createCharacter({
    name: 'Ellen Joe',
    preferredSet4p: 'polar_metal',
    preferredSet2p: 'proto_punk',
    mainStatPreferences: {
      slot4: ['CRIT Rate', 'CRIT DMG'],
      slot5: ['Ice DMG', 'ATK%'],
      slot6: ['ATK%']
    },
    subStatPriority: ['CRIT Rate', 'CRIT DMG', 'ATK%', 'PEN Ratio']
  }));
  
  // Character 2: Anomaly Character
  characters.push(createCharacter({
    name: 'Jane Doe',
    preferredSet4p: 'freedom_blues',
    preferredSet2p: null,
    mainStatPreferences: {
      slot4: ['Anomaly Proficiency', 'ATK%'],
      slot5: ['Physical DMG', 'ATK%'],
      slot6: ['Anomaly Proficiency']
    },
    subStatPriority: ['Anomaly Proficiency', 'ATK%', 'CRIT Rate', 'PEN']
  }));
  
  // Character 3: Support
  characters.push(createCharacter({
    name: 'Nicole Demara',
    preferredSet4p: 'swing_jazz',
    preferredSet2p: 'soul_rock',
    mainStatPreferences: {
      slot4: ['DEF%', 'HP%'],
      slot5: ['Ether DMG', 'DEF%'],
      slot6: ['Energy Regen', 'DEF%']
    },
    subStatPriority: ['DEF%', 'HP%', 'Energy Regen', 'ATK%']
  }));
  
  return characters;
}

// ================================
// SAMPLE DISCS
// ================================

export function createSampleDiscs() {
  const discs = [];
  
  // Polar Metal set for Ellen (Ice DPS)
  discs.push(createDisc({
    setId: 'polar_metal',
    slot: 1,
    mainStat: 'HP',
    subStats: [
      ['CRIT Rate', 3],
      ['CRIT DMG', 2],
      ['ATK%', 1],
      ['DEF%', 0]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'polar_metal',
    slot: 2,
    mainStat: 'ATK',
    subStats: [
      ['CRIT Rate', 2],
      ['CRIT DMG', 3],
      ['ATK%', 1],
      ['PEN Ratio', 0]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'polar_metal',
    slot: 3,
    mainStat: 'DEF',
    subStats: [
      ['CRIT Rate', 1],
      ['CRIT DMG', 2],
      ['ATK%', 2],
      ['HP%', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'polar_metal',
    slot: 4,
    mainStat: 'CRIT Rate',
    subStats: [
      ['CRIT DMG', 4],
      ['ATK%', 2],
      ['PEN Ratio', 1],
      ['DEF%', 0]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'polar_metal',
    slot: 5,
    mainStat: 'Ice DMG',
    subStats: [
      ['CRIT Rate', 3],
      ['CRIT DMG', 2],
      ['ATK%', 1],
      ['PEN', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'proto_punk',
    slot: 6,
    mainStat: 'ATK%',
    subStats: [
      ['CRIT Rate', 2],
      ['CRIT DMG', 3],
      ['PEN Ratio', 1],
      ['HP%', 0]
    ]
  }));
  
  // Freedom Blues set for Jane (Anomaly)
  discs.push(createDisc({
    setId: 'freedom_blues',
    slot: 1,
    mainStat: 'HP',
    subStats: [
      ['Anomaly Proficiency', 3],
      ['ATK%', 2],
      ['CRIT Rate', 1],
      ['DEF%', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'freedom_blues',
    slot: 2,
    mainStat: 'ATK',
    subStats: [
      ['Anomaly Proficiency', 4],
      ['ATK%', 1],
      ['CRIT Rate', 1],
      ['PEN', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'freedom_blues',
    slot: 4,
    mainStat: 'Anomaly Proficiency',
    subStats: [
      ['ATK%', 3],
      ['CRIT Rate', 2],
      ['PEN', 1],
      ['HP%', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'freedom_blues',
    slot: 5,
    mainStat: 'Physical DMG',
    subStats: [
      ['Anomaly Proficiency', 2],
      ['ATK%', 3],
      ['CRIT Rate', 1],
      ['CRIT DMG', 1]
    ]
  }));
  
  // Some unequipped discs for inventory
  discs.push(createDisc({
    setId: 'woodpecker_electro',
    slot: 4,
    mainStat: 'CRIT Rate',
    subStats: [
      ['CRIT DMG', 3],
      ['ATK%', 2],
      ['DEF%', 1],
      ['HP%', 0]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'thunder_metal',
    slot: 5,
    mainStat: 'Electric DMG',
    subStats: [
      ['CRIT Rate', 2],
      ['CRIT DMG', 2],
      ['ATK%', 2],
      ['PEN Ratio', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'swing_jazz',
    slot: 6,
    mainStat: 'Energy Regen',
    subStats: [
      ['DEF%', 3],
      ['HP%', 2],
      ['ATK%', 1],
      ['CRIT Rate', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'chaos_jazz',
    slot: 4,
    mainStat: 'Anomaly Proficiency',
    subStats: [
      ['ATK%', 2],
      ['PEN', 2],
      ['CRIT Rate', 1],
      ['DEF%', 1]
    ]
  }));
  
  discs.push(createDisc({
    setId: 'inferno_metal',
    slot: 5,
    mainStat: 'Fire DMG',
    subStats: [
      ['CRIT Rate', 3],
      ['CRIT DMG', 1],
      ['ATK%', 2],
      ['HP%', 1]
    ]
  }));
  
  return discs;
}

// ================================
// LOAD TEST DATA
// ================================

export function loadTestData() {
  console.log('📝 Loading test data...');
  
  const characters = createSampleCharacters();
  const discs = createSampleDiscs();
  
  characters.forEach(char => saveCharacter(char));
  discs.forEach(disc => saveDisc(disc));
  
  console.log('✅ Test data loaded:', characters.length, 'characters,', discs.length, 'discs');
  
  return { characters, discs };
}
