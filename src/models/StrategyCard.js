import Card from './Card';

export default class StrategyCard extends Card{
    
    constructor({name, cost, strategyType, description}){
        super({name, cost, type: 'Strategy'});
        this.strategyType = strategyType;
        this.description = description;
    }
    
}