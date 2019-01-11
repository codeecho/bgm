import './App.less'
import 'react-toastify/dist/ReactToastify.css';

import React, {Component} from 'react'

import { Button, Table, Panel, Row, Col, Badge, Modal} from 'react-bootstrap';

import StateManager from './StateManager';

import { ToastContainer, toast } from 'react-toastify';

class App extends Component {
    
    constructor(props){
      super(props);
      
      this.stateManager = new StateManager();
      
      this.state = this.stateManager.state;
      
      this.endTurn = this.handleUpdate(this.stateManager.endTurn).bind(this);         
      this.discard = this.handleUpdate(this.stateManager.discard).bind(this);   
      this.buy = this.handleUpdate(this.stateManager.buy).bind(this);         
      this.play = this.handleUpdate(this.stateManager.play).bind(this);       
      this.sub = this.handleUpdate(this.stateManager.sub).bind(this);      
      this.trade = this.handleUpdate(this.stateManager.trade).bind(this);       

      this.viewHand = this.handleUpdate(this.stateManager.viewHand).bind(this); 
      this.viewSquad = this.handleUpdate(this.stateManager.viewSquad).bind(this); 
      this.hideSummary = this.handleUpdate(this.stateManager.hideSummary).bind(this);      
      
    }
    
    handleUpdate(f){
        function doUpdate() {
            f.apply(this.stateManager, arguments);
            this.setState(this.stateManager.state);
        };
        return doUpdate;
    }
    
    render() {
        
        const { view, tradeDeck, tradeRow, availableIncome, activePlayer, players, stage, round, showSummary, gameOver, summary, activeSubType, activeSubIndex } = this.state;
        
        const player = players[activePlayer];
        
        const { hand, deck, discardPile, activeHand, starters, bench, reserves, startersRating, benchRating, squadRating, eventCard, totalRating } = player; 
        
        return (
            <div className="container">
                <div className="card-table">
                    {view === 'hand' && <div className="hand-view">
                        <Row>
                            <div class="main-area trade-area">
                                { tradeRow.map(card => <Card card={card} buy={() => this.buy(card)} />) }
                            </div>
                            <div class="side-area">
                                <Deck name="Trade Deck" deck={tradeDeck} />
                                <div class="card deck">
                                    <div class="card-data-table">
                                      <h3>Game Status</h3>
                                		<table class="table table-striped">
                                        <tbody>
                                          <tr>
                                            <th>Stage</th>
                                            <td>{stage}</td>
                                          </tr>
                                          <tr>
                                            <th>Round</th>
                                            <td>{round}</td>
                                          </tr>
                                          <tr>
                                            <th>Player 1</th>
                                            <td>{players[0].points}</td>
                                          </tr>
                                          <tr>
                                            <th>Player 2</th>
                                            <td>{players[1].points}</td>
                                          </tr>
                                          <tr>
                                            <th>Turn</th>
                                            <td>Player {activePlayer+1}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                                      <button class="btn btn-info btn-lg" onClick={this.endTurn}>End Turn</button>
                                  </div>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <div class="main-area">
                                { activeHand.map(card => <Card card={card} />) }
                            </div>
                            <div class="side-area">
                                <EventCard card={eventCard} />                            
                                <div class="card deck">
                                    <div class="card-data-table">
                                      <h3>Hand Status</h3>
                                		<table class="table table-striped">
                                        <tbody>
                                          <tr>
                                            <th>Income</th>
                                            <td>{availableIncome}</td>
                                          </tr>
                                          <tr>
                                            <th>Rating</th>
                                            <td>{totalRating}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                                      <button class="btn btn-info btn-lg" onClick={this.viewSquad}>View Squad</button>
                                  </div>
                                </div>                                
                            </div>
                        </Row>
                        <Row>
                            <div class="main-area">
                                { hand.map(card => <Card card={card} play={() => this.play(card)} discard={() => this.discard(card)} />) }
                            </div>
                            <div class="side-area">
                                <Deck name="Discard" deck={discardPile} />                    
                                <Deck name="Deck" deck={deck} />
                            </div>
                        </Row>
                    </div>}
                    {view === 'squad' && <div class="squad-view">
                        <Row>
                            <Card card={starters.pg} position="PG" selected={activeSubType === 'starters' && activeSubIndex === 'pg'} trade={() => this.trade('starters', 'pg')} sub={() => this.sub('starters', 'pg')} />
                            <Card card={starters.sg} position="SG" selected={activeSubType === 'starters' && activeSubIndex === 'sg'} trade={() => this.trade('starters', 'sg')} sub={() => this.sub('starters', 'sg')} />
                            <Card card={starters.sf} position="SF" selected={activeSubType === 'starters' && activeSubIndex === 'sf'} trade={() => this.trade('starters', 'sf')} sub={() => this.sub('starters', 'sf')} />
                            <Card card={starters.pf} position="PF" selected={activeSubType === 'starters' && activeSubIndex === 'pf'} trade={() => this.trade('starters', 'pf')} sub={() => this.sub('starters', 'pf')} />
                            <Card card={starters.c} position="C" selected={activeSubType === 'starters' && activeSubIndex === 'c'} trade={() => this.trade('starters', 'c')} sub={() => this.sub('starters', 'c')} />
                            <div class="card deck">
                                <div class="card-data-table">
                                  <h3>Squad Status</h3>
                            		<table class="table table-striped">
                                    <tbody>
                                      <tr>
                                        <th>Starters</th>
                                        <td>{startersRating}</td>
                                      </tr>
                                      <tr>
                                        <th>Bench</th>
                                        <td>{benchRating}</td>
                                      </tr>
                                      <tr>
                                        <th>Total</th>
                                        <td>{squadRating}</td>
                                      </tr>
                                  </tbody>
                              </table>
                                  <button class="btn btn-info btn-lg" onClick={this.viewHand}>View Hand</button>
                                  <button disabled={!activeSubType} class="btn btn-info btn-lg" onClick={this.trade}>Trade Player</button>
                              </div>
                            </div>
                        </Row>
                        <Row>
                            <Card card={bench.g} position="G" selected={activeSubType === 'bench' && activeSubIndex === 'g'} trade={() => this.trade('bench', 'g')} sub={() => this.sub('bench', 'g')} />
                            <Card card={bench.f} position="F" selected={activeSubType === 'bench' && activeSubIndex === 'f'} trade={() => this.trade('bench', 'f')} sub={() => this.sub('bench', 'f')} />
                            <Card card={bench.c} position="C" selected={activeSubType === 'bench' && activeSubIndex === 'c'} trade={() => this.trade('bench', 'c')} sub={() => this.sub('bench', 'c')} />
                        </Row>
                        <Row>
                            { reserves.map((card, i) => <Card card={card} selected={activeSubType === 'reserves' && activeSubIndex === i} trade={() => this.trade('reserves', i)} sub={() => this.sub('reserves', i)} />) }                    
                        </Row>
                    </div>}
                </div>
                <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} hideProgressBar={true} />
                {showSummary && <Modal show={showSummary}>
                    <Modal.Header>
                      <Modal.Title>Weekly Summary</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Player 1</th>
                                    <th>Player 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Starters</th>
                                    <td>{summary[0].startersRating}</td>
                                    <td>{summary[1].startersRating}</td>
                                </tr>
                                <tr>
                                    <th>Bench</th>
                                    <td>{summary[0].benchRating}</td>
                                    <td>{summary[1].benchRating}</td>
                                </tr>
                                <tr>
                                    <th>Squad</th>
                                    <td>{summary[0].squadRating}</td>
                                    <td>{summary[1].squadRating}</td>
                                </tr>
                                <tr>
                                    <th>Bonus</th>
                                    <td>{summary[0].bonusEnergy}</td>
                                    <td>{summary[1].bonusEnergy}</td>
                                </tr>
                                <tr>
                                    <th>Dice Roll</th>
                                    <td>{summary[0].diceRoll}</td>
                                    <td>{summary[1].diceRoll}</td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <td>{summary[0].finalRating}</td>
                                    <td>{summary[1].finalRating}</td>
                                </tr>
                                <tr>
                                    <th>Points</th>
                                    <td>{summary[0].points}</td>
                                    <td>{summary[1].points}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button bsStyle="primary" onClick={this.hideSummary}>Close</Button>
                    </Modal.Footer>
                </Modal>}
                {gameOver && <Modal show={gameOver}>
                    <Modal.Header>
                      <Modal.Title>Game Over</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {players.find(p => p.winner).name} is the winner!
                    </Modal.Body>
                </Modal>}
            </div>
        )
    }
}

function Card(props){
    const { card, sub, position } = props;
    if(!card) return <PlayerCardPlaceholder sub={sub} position={position} />;
    const { type } = card;
    switch(type){
        case 'Operations': return <OperationsCard {...props} />;
        case 'Player': return <PlayerCard {...props} />;
        case 'Strategy': return <StrategyCard {...props} />;        
        default: return null;
    }
}

function EventCard(props){
    const {card} = props
    const { name, description, energy, money } = card;
    return (
        <div class="card event-card">
            <h3>{name}</h3>
		    <img src="http://www.restaurantnews.com/wp-content/uploads/2017/07/Firebird-Restaurant-Group-Acquires-Village-Burger-Bar.jpg" alt="Northern Pike" class="pic" />
		    <div class="infobox">
                {energy && <div class="card-body-icon">
                    <img src="https://image.flaticon.com/icons/svg/607/607303.svg" />
                    <span>{energy > 0 ? '+' + energy : energy}</span>
                </div>}
                { money > 0 && <div class="card-body-icon">
                    <img src="https://visualpharm.com/assets/688/Paper%20Money-595b40b65ba036ed117d3bfa.svg" />
                    <span>{money > 0 ? '+' + money : money}</span>
                </div>}
                <p class="effect">{description}</p>
		    </div>
		</div>
    )
}

function OperationsCard(props){
    const {card, buy, play} = props
    const { name, cost, income, draw } = card;
    
    return (
        <div class="card operations-card" onClick={buy || play}>
            <h3>{name} <span class="number-indicator">{cost}</span></h3>
    		<img src="http://www.restaurantnews.com/wp-content/uploads/2017/07/Firebird-Restaurant-Group-Acquires-Village-Burger-Bar.jpg" alt="Northern Pike" class="pic" />
    		<div class="infobox">
    			<p class="fact"></p>
                { income > 0 && <div class="card-body-icon">
                    <img src="https://visualpharm.com/assets/688/Paper%20Money-595b40b65ba036ed117d3bfa.svg" />
                    <span>+{income}</span>
                </div>}
                {draw > 0 && <p class="card-draw-text">Draw {draw} card</p>}
    		</div>
    	</div>
    )
}

function StrategyCard(props){
    const {card, buy, play} = props
    const { name, cost, description, energy, money, bonus } = card;
    return (
        <div class="card strategy-card" onClick={buy || play}>
            <h3>{name} <span class="number-indicator">{cost}</span></h3>
		    <img src="http://www.restaurantnews.com/wp-content/uploads/2017/07/Firebird-Restaurant-Group-Acquires-Village-Burger-Bar.jpg" alt="Northern Pike" class="pic" />
		    <div class="infobox">
			    <p class="fact"></p>
			    <p class="effect">{description}</p>
			    {energy && <div class="card-body-icon">
                    <img src="https://image.flaticon.com/icons/svg/607/607303.svg" />
                    <span>+{energy}</span>
                </div>}
                {bonus && <div class="card-body-icon">
                    <img src="https://image.flaticon.com/icons/svg/607/607303.svg" />
                    <span>+{bonus}</span>
                </div>}
                { money > 0 && <div class="card-body-icon">
                    <img src="https://visualpharm.com/assets/688/Paper%20Money-595b40b65ba036ed117d3bfa.svg" />
                    <span>+{money}</span>
                </div>}
		    </div>
	    </div>
    )
}

function PlayerCard(props){
    const {card, buy, sub, selected} = props
    const { name, cost, ability, benchAbility, tradeValue, positions, attributes, injury, suspension, bonusAbility, bonusAttributes} = card;
    return (
        <div class={'card player-card ' + (selected ? 'selected' : '')} onClick={buy || sub}>
            <h3> {name} <span class="number-indicator cost">{cost}</span></h3>
            {positions && <span class="number-indicator position">{positions.join(', ')}</span>}
		    <img src="http://www.restaurantnews.com/wp-content/uploads/2017/07/Firebird-Restaurant-Group-Acquires-Village-Burger-Bar.jpg" alt="Northern Pike" class="pic" />
		    <div class="infobox">
                <p class="attributes">{attributes.concat(bonusAttributes).join(', ')}&nbsp;</p>
                <p class="effect">&nbsp;</p>
                <div class="ability">
                    <span class="number-indicator ability">{ability}</span>
                    <span class="number-indicator bench-ability">{benchAbility}</span>
                    <span class="number-indicator bonus">{bonusAbility}</span>
                </div>
		    </div>
        </div>
    )
}

function PlayerCardPlaceholder(props){
    return (
        <div class="card deck" onClick={props.sub}>
		  <div class="deck-count">{props.position || 'N/A'}</div>
	    </div>
    )
}

function CardActions({discard, buy, play, trade, sub}){
    return (
        <div>
            {buy && <Button onClick={buy}>Buy</Button>}                
            {play && <Button onClick={play}>Play</Button>}
            {trade && <Button onClick={trade}>Trade</Button>}            
            {false && discard && <Button onClick={discard}>Discard</Button>} 
            {sub && <Button onClick={sub}>Sub</Button>}            
        </div>
    )
}

function Deck({name, deck}){
    const { length } = deck;
    return (
        <div class="card deck">
		  <div class="deck-count">{length}</div>
	    </div>
    )
}

export default App
