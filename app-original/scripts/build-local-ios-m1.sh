#!/bin/bash
sh scripts/remove-m1-dependencies/remove.sh
sh update-props.sh 'qa'
ionic capacitor build ios --no-open -c uat
ionic capacitor open ios