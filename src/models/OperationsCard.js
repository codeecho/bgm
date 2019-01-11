import Card from './Card';

export default class OperationsCard extends Card{
    
    constructor({ name, cost = 1, income = 0, draw = 0}){
        super({name, cost, type: 'Operations'});
        this.income = income;
        this.draw = draw;
    }
    
}