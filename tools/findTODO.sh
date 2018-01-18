#! /bin/bash
find . -type f  -not \( -path '*git*' -prune \) \
                -not \( -path '*build*' -prune \) \
                -not \( -path '*node_modules*' -prune \) \
                -not \( -path '*tools*' -prune \)  -exec grep -Hn "TODO" {} ";" 

