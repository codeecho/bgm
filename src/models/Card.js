export default class Card{
    
    constructor({ name, cost = 1, type}){
        this.name = name;
        this.cost = cost;
        this.type = type;
    }
    
}