import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Storage } from '@ionic/storage';

/*
  Generated class for the FavoritesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoritesProvider {
	items = {};
	_KEY = '_LIST';

  	private someSource = new Subject<any>();

  	itemsSource$ = this.someSource.asObservable();

	constructor(private storage: Storage) {
		this.load();
	}

    load() {
	    this.storage.get(this._KEY).then((value) => {
	      if (value) {
	        this.items = value;
	        this.someSource.next(this.items);
	      } else {
	      	this.storage.set(this._KEY, this.items).then(value => {
	      		this.someSource.next(value);
	      	});
	      }
    	});
  	}

  	addToList(key, value) {
  		if(!this.items[key]) {
  			this.items[key] = [];
  		}
  		this.items[key].push(value);
      	return this.storage.set(this._KEY, this.items).then(value => {
      		this.someSource.next(value);
      	});
  	}
  	removeFromList(key, value) {
  		const index = this.items[key].findIndex(elem => elem.Id === value.Id);
  		this.items[key].splice(index, 1);
      	return this.storage.set(this._KEY, this.items).then(value => {
      		this.someSource.next(value);
      	});
  	}

}
