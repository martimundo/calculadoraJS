/**
 * Criando uma classe em JS
 * Uma classe é um conjunto de atributos e metodos...
 * as Variaveis são chamadas de: atributos.
 * as Ações são chamadas de: Métodos
 * Obs: Quando uma função esta dentro de uma classe ela é chamada de médoto. Contudo,
 * quando a função esta fora da classe ela é chamada de "Função".
 * 
 * Qdo olharmos um atributo e ele conter um underline na frente do atributo, quer dizer que ele é privado..
 * 
 * Após crair os atributos precisamos crair os metodos getters e setters;
 */

class CalcController {

    /**
     * Construtor da classe que inicializa alguns metodos e propriedades desta classe.
     */
    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-Br';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    /**
     * Metodo para copiar o texto...
     */
    copyToClipboard() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.displayCalc);

        }
    }

    /**
     * Metodo para Colar
     */

    pasteFromClipboard() {

        document.addEventListener('past', e => {
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
        });
    }


    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();

        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();
            })
        });
    }
    /**
     * Metodo que vai escutar todos os tipos de eventos executados.
     */
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    /**
     * Verifica se o audio esta ligado ou desligado.
     */
    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;
    }

    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }


    /**
     * Metodo que vai capturar os eventos do teclado. 
     */

    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }

        })
    }

    //Limpa todas as entradas
    clearAll() {
        this._operation = [];
        this.lastNumber = '';
        this.lastOperation = '';
        this.setLastNumberToDisplay();
    }

    //cancela a ultima entrada
    clearEntry() {

        this._operation.pop();

        this.setLastNumberToDisplay();
    }

    //add informação no display de erro
    setError() {

        this.displayCalc = "Error";
    }

    //retorna o ultimo item da listagem do array de operações
    getLastOperation() {

        return this._operation[this._operation.length - 1];
    }

    //verifica se é um operador.
    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }


    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();
        }
    }

    getResult() {

        try {
            return eval(this._operation.join(""));

        } catch (e) {
                        
            setTimeout(() => this.setError(), 1);
        }



    }

    //Metodo que realizado os calculos
    calc() {

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];

            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {

            this._operation.pop();//retira o ultimo elemento...

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getResult(false);
        }


        let result = this.getResult();


        if (last == "%") {

            result /= 100;
            this._operation = [result];

        } else {
            this._operation = [result];

            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    //metodo que vai pegar o ultimo item se for uma operação
    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

        }
        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    //metodo que atualiza os itens do display
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    //metodo para adicionar o ponto para os calculos
    addDot() {
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split().indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();

        console.log(lastOperation);

    }


    //adiciona uma operação no display
    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);

            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation((newValue));

                this.setLastNumberToDisplay();
            }
        }
        //this._operation.push(value);
        console.log(this._operation);
    }

    //vai realizar uma ação conforme o botão precionado na calculadora
    execBtn(value) {
        this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');

                break;

            case 'multiplicacao':
                this.addOperation('*');

                break;

            case 'divisao':
                this.addOperation('/');

                break;

            case 'subtracao':
                this.addOperation('-');

                break;

            case 'porcento':
                this.addOperation('%');

                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':

                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }

    };

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");//Seleciona todas os elementos pai e filho

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, "mouseover mouseup mouosedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    //Metodo para atualizar a hora
    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    /**
     * Getters e Setters
     */
    get displayTime() {
        return this._timeEl.innerHTML;
    }
    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }
    set currentDate(value) {
        this._currentDate = value;
    }

}