This test repository demonstrates various validation errors:

1. Root level violations:
   - unexpected_file.txt (file not in structure)
   - unexpected_dir/ (directory not in structure)

2. Missing required files that ARE in structure:
   - .gitignore, LICENSE, README.md are missing

3. pub/src violations:
   - wrong_file.js (doesn't match any wildcard)
   - bin/wrong.js (doesn't match /*.ts pattern)
   - __internal/subdir/file.ts (pattern doesn't allow subdirs)
   - procedures/sub/nested.ts (pattern doesn't allow subdirs)
   - transformations/file.ts (pattern requires /*/**/*.ts, not just /*)
   - operations/ (directory not in structure)

4. Warning violations:
   - exceptional/ and temp/ should generate warnings
