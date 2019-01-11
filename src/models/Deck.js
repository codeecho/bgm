import shuffle from 'shuffle-array';

export default class Deck{
    
    constructor({cards = []}){
        this.cards = cards;
    }
    
    shuffle(){
        shuffle(this.cards);
    }
    
    draw(n = 1){
        return this.cards.splice(0, n);
    }
    
    drawSingle(){
        const cards = this.draw(1);
        return cards.length > 0 ? cards[0] : null;
    }
    
    add(cards){
        if(!cards) return;
        this.cards = this.cards.concat(cards);
    }
    
    get length(){
        return this.cards.length;
    }
    
    remove(card){
        this.cards = this.cards.filter(c => c != card);
    }
    
    find(filter){
        return this.cards.find(filter);
    }
}