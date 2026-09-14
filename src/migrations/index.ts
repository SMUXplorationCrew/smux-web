import * as migration_20260912_062042_baseline from './20260912_062042_baseline';
import * as migration_20260912_065151_elite_upgrade from './20260912_065151_elite_upgrade';
import * as migration_20260914_152134_slug_history from './20260914_152134_slug_history';

export const migrations = [
  {
    up: migration_20260912_062042_baseline.up,
    down: migration_20260912_062042_baseline.down,
    name: '20260912_062042_baseline',
  },
  {
    up: migration_20260912_065151_elite_upgrade.up,
    down: migration_20260912_065151_elite_upgrade.down,
    name: '20260912_065151_elite_upgrade',
  },
  {
    up: migration_20260914_152134_slug_history.up,
    down: migration_20260914_152134_slug_history.down,
    name: '20260914_152134_slug_history'
  },
];
