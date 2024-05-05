import Phaser from "phaser";

import Hud from '../../assets/HUD/HUD.json';
import healthDisplay from "../HUD/healthDisplay";
import manaDisplay from "../HUD/manaDisplay";
import keysDisplay from "../HUD/keysDisplay";
import shieldDisplay from "../HUD/shieldDisplay";
import weaponDisplay from "../HUD/weaponDisplay";

import { eventManager as hudEvents } from "../eventCenter";

export default class GUI extends Phaser.Scene {

    constructor() {
        super({ key: 'gui' });
        
    }

    preload() {
        this.load.tilemapTiledJSON('hud', Hud);
    }

    init(obj) {
        this.life = obj.life;
        this.maxLife = obj.maxLife;
        this.mana = obj.mana;
        this.maxMana = obj.maxMana;
        this.weaponEquiped = obj.equipedWeapon;
        this.keys = obj.keys
    }

    create() {
        this.map = this.make.tilemap({ 
            key: 'hud', 
            tileWidth: 32, 
            tileHeight: 32 
        });
        
        let objectLayer = this.map.getObjectLayer('HUD');
        objectLayer.objects.forEach(obj => {
            switch(obj.name) {
                case 'LifeBar':
                    //Valor inicial de la vida maxima: 10
                    this.playerLifeBar = new healthDisplay(this, obj.x, obj.y, this.life, this.maxLife);
                    break;
                case 'Manabar':
                    //Valores inciales del manaInicial y el manaMaximo: 250 y 500
                    this.playerManaBar = new manaDisplay(this, obj.x, obj.y, obj.width, obj.height, this.mana, this.maxMana);
                    break;
                case 'Keys':
                    //Valor inicial de las llaves: 1
                    this.playerKeysInfo = new keysDisplay(this, obj.x + 70, obj.y, 'key', this.keys);
                    break;
                case 'Shield':
                    this.playerShieldInfo = new shieldDisplay(this, obj.x + 48, obj.y - 4, 'ready_ui_shield', 'cd_ui_shield');
                    break;
                case 'ArmaEquipada':
                    this.displayEquipedWeapon = new weaponDisplay(this, obj.x, obj.y, obj.width, obj.height, this.weaponEquiped.id);
                    break;
                default:
                    console.warn('Tipo de objeto no reconocido:', obj.name);
            }
        });

        hudEvents.on('updateHealth', (playerHealth) => {
            this.playerLifeBar.updateHealth(playerHealth);
        });

        hudEvents.on('updateMana', (playerManaStats) => {
            this.playerManaBar.setMeterPercentageAnimated(playerManaStats[0] / playerManaStats[1]);
        });

        hudEvents.on('updateDisplayedWeapon', (newWeapon) => {
            this.displayEquipedWeapon.updateDisplay(newWeapon);
        });

        hudEvents.on('updateMoney', (money) => {
            this.playerMoneyInfo.setMoney(money);
        });

        hudEvents.on('updateKeys', (keys) => {
            this.playerKeysInfo.updateKeys(keys);
        });

        hudEvents.on('updateShield', (isItReady) => {
            this.playerShieldInfo.updateShield(isItReady);
        });
    }
}