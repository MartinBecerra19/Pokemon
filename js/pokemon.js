export class Pokemon {
    constructor(name, img, id) {
        this.name = name;
        this.img = img;
        this.id = id;
        this.types = [];
        this.stats = {};
    }
    getTypes() {
        if (this.types[1] == undefined) {
            return "tipo1: " + this.types[0];
        } else {
            return "tipo1: " + this.types[0] + "<br> tipo2: " + this.types[1]
        }
    }
    getStats() {
        var texto = "";
        for (const stat in this.stats) {
            texto += stat + ":" + this.stats[stat] + "<br>"
        }
        return texto;
    }
}