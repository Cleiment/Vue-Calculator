const Calc = {
    data(){
        return {
            number: '',
            computed: ['0'],
            opStr: '0',
            result : []
        }
    },
    methods : {
        inputNumber(number){
            if (this.computed[0] != '0'){
                this.number += number;
                if (this.computed.length != 0){
                    this.computed[this.computed.length - 1] = this.number;
                }else{
                    this.computed[0] = this.number;
                }
            }
            else{
                this.computed[0] = number.toString();
                this.number = number.toString();
            }
            this.reOpStr();
        },
        toggleHistory(tg){
            if(tg == 'open'){
                this.result = JSON.parse(localStorage.getItem('history'));
            }else{
                this.result = [];
            }
        },
        inputOperator(op){
            var opr = op.toLowerCase();
            if (opr == "c"){
                this.computed = ['0'];
                this.number = '';
            }else if (opr == "back"){
                if (this.computed.length != 0 && this.computed[this.computed.length - 1] != '') {
                    this.computed[this.computed.length - 1] = this.computed[this.computed.length - 1].substring(0, this.computed[this.computed.length - 1].length - 1);
                    this.number = this.number.substring(0, this.number.length - 1);
                }else if (this.computed.length != 0 && this.computed[this.computed.length -1] == ''){
                    this.computed = this.computed.slice(0, this.computed.length - 2);
                    this.number = this.computed[this.computed.length - 1];
                }
            }else if(opr == '%'){
                if (this.computed.length%2 != 0 && this.computed[this.computed.length - 1] != ''){
                    this.computed[this.computed.length - 1] = parseInt(this.computed[this.computed.length - 1]) * 0.01;
                }
            }else if(opr == '/'){
                this.computed[this.computed.length] = ' / ';
                this.newNumber();
            }else if(opr == 'x'){
                this.computed[this.computed.length] = ' * ';
                this.newNumber();
            }else if(opr == '-'){
                this.computed[this.computed.length] = ' - ';
                this.newNumber();
            }else if(opr == '+'){
                this.computed[this.computed.length] = ' + ';
                this.newNumber();
            }else if(opr == 'h'){
                if(this.result[0] == null){
                    this.toggleHistory('open');
                }else{
                    this.toggleHistory('close');
                }
            }
            this.reOpStr();
            if(opr == '='){
                if (this.computed.length == 0){
                    return
                }else if(this.computed.length%2 == 0 && this.computed.length > 0){
                    this.computed[this.computed.length] = this.computed[this.computed.length - 2];
                }
                this.computed[this.computed.length] = ` = ${eval(this.opStr)}`;
                this.reOpStr();
                var dataStored = JSON.parse(localStorage.getItem('history'));
                if (dataStored != null){
                    dataStored[dataStored.length] = this.opStr;
                }else{
                    dataStored = [this.opStr]
                }
                localStorage.setItem('history', JSON.stringify(dataStored));
                this.computed = ['0'];
                this.number = '';
                this.toggleHistory('open');
            }
        },
        newNumber(){
            this.computed[this.computed.length] = '';
            this.number = '';
        },
        reOpStr(){
            this.opStr = '';
            for (let i = 0; i < this.computed.length; i++) {
                this.opStr += this.computed[i];
            };
            // console.log(this.computed);
            // console.log(this.number);
        }
    }
}

var calc = Vue.createApp(Calc);

calc.component('num-key', {
    props: ['num'],
    template: `<button class="keys num-key">{{ num }}</button>`
});

calc.component('func-key', {
    props: ['symbol'],
    template: '<button class="keys func-key">{{ symbol }}</button>'
})

calc.mount('#calc');