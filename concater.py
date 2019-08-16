# Concatenator utile for scripts
# Replace all strings with kind #: import file.ext to content of file file.ext
# Usage: py concater.py [input_directory] [output_directory]
# Autor: Tsvikevich Denis-2019

import sys
import re
from os import listdir
from os.path import isfile, join
from pathlib import Path

input_directory = sys.argv[1]
output_directory = sys.argv[2]

# All files in input directory
input_files = [f for f in listdir(input_directory) if isfile(join(input_directory, f))]

for f in input_files:
	content = Path(join(input_directory, f)).read_text(encoding="utf-8")
	output_file = Path(join(output_directory, f))
	result = re.sub(r"#:\s*import\s+(.+)", lambda m: Path(join(input_directory, m[1])).read_text(encoding="utf-8"), content)
	output_file.write_text(result, encoding="utf-8")
