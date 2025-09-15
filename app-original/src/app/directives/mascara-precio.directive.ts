    import { Directive, Attribute } from '@angular/core';
    import { NgModel } from '@angular/forms';
    @Directive({
      selector: '[mask]',
      host: {
          '(keyup)': 'onInputChange($event)'
      },
      providers: [NgModel]
    })
    export class MascaraPrecio {
        maskPattern: string;
        placeHolderCounts: number;
        dividers: string[];
        modelValue: string;
        viewValue: string;

        constructor(
            public model: NgModel,
            @Attribute("mask") maskPattern: string
        ) {
            this.dividers = maskPattern.replace(/\*/g, "").split("");
            this.dividers.push(" ");
            this.generatePattern(maskPattern);
    }

    onInputChange(event: any) {
        this.modelValue = this.getModelValue(event);
        let stringToFormat = this.modelValue;
        if (stringToFormat.length < 10) {
            stringToFormat = this.padString(stringToFormat);
        }
        this.viewValue = this.format(stringToFormat);
        this.writeValue(event.target, this.viewValue);
    }

    writeValue(target: any, value: any) {
        return target.value = value;
    }

    generatePattern(patternString: any) {
        this.placeHolderCounts = (patternString.match(/\*/g) || []).length;
        for (let i = 0; i < this.placeHolderCounts; i++) {
            patternString = patternString.replace('*', '{' + i + '}');
        }
        this.maskPattern = patternString;
    }

    format(s: any): string {
        let formattedString: string = this.maskPattern;
        for (let i = 0; i < this.placeHolderCounts; i++) {
            formattedString = formattedString.replace("{" + i + "}", s.charAt(i));
        }
        return formattedString;
    }

    padString(s: any) {
        const pad = '          ';
        return (s + pad).substring(0, pad.length);
    }

        getModelValue(event) {
            let modelValue = event.target.value;
            for (var i = 0; i < this.dividers.length; i++) {
                while (modelValue.indexOf(this.dividers[i]) > -1) {
                    modelValue = modelValue.replace(this.dividers[i], "");
                }
            }
            return modelValue;
        }
    }