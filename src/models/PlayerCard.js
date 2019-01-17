import Card from './Card';

export default class PlayerCard extends Card{
    
    constructor({ name, cost, positions, ability, attributes = [], injury = 0, suspension = 0, boosts = [], boosters = [], description, chemistry }){
        super({name, cost, type: 'Player'});
        this.positions = positions;
        this.ability = ability;
        this.attributes = attributes;
        this.injury = injury;
        this.suspension = suspension;
        this.boosts = boosts;
        this.boosters = boosters;
        this.bonusAbility = 0;
        this.bonusAttributes = [];
        this.description = description;
        this.chemistry = chemistry;
    }
    
    get benchAbility(){
        return Math.ceil(this.ability / 2);
    }
    
    get tradeValue(){
        return Math.max(this.cost - 2, 0);
    }
    
}