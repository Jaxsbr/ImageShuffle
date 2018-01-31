$.ShuffleGame = function () {
	this.Tiles = [];

	this.Cols = 4;
	this.Rows = 4;

	this.SourceX = 0;
	this.SourceY = 0;
	this.SourceWidth = 600;
	this.SourceHeight = 600;

	this.TileWidth = this.SourceWidth / this.Cols;
	this.TileHeight = this.SourceHeight / this.Rows;

	this.ExcludeIndex = this.Cols * this.Rows;
};

$.ShuffleGame.prototype.Start = function () {
	var width = this.SourceWidth / this.Cols;
	var height = this.SourceHeight / this.Rows;

	var index = 0;
	for (var col = 0; col < this.Cols; col++) {
		this.Tiles[col] = new Array();

		for (var row = 0; row < this.Rows; row++) {
			index++;

			this.Tiles[col][row] = {
				Col: col,
				Row: row,
				OriginalIndex: index,
				CurrentIndex: index,
				Bounds: new $.Rectangle(
					col * width,
					row * height,
					width,
					height),
				IsBlank: index == this.ExcludeIndex
			}
		}
	}

	this.Shuffle();
};

$.ShuffleGame.prototype.Shuffle = function () {
	var used = [];
	for (var col = 0; col < this.Cols; col++) {
		for (var row = 0; row < this.Rows; row++) {
			var shuffle = 0;
			while (shuffle == 0) {
				shuffle = Math.floor($.RandomBetween(1, (this.Rows * this.Cols) + 0.99));

				var alreadyUsed = false;
				for (var u = 0; u < used.length; u++) {
					if (used[u] === shuffle) {
						alreadyUsed = true;
						break;
					}
				}

				if (alreadyUsed) {
					shuffle = 0;
				}
				else {
					used.push(shuffle);
					this.Tiles[col][row].CurrentIndex = shuffle;
				}

			}
		}
	}
};

$.ShuffleGame.prototype.MouseUp = function () {
	var mX = $.MousePoint.X;
	var mY = $.MousePoint.Y;

	var width = $.CanvasBounds.Width / this.Cols;
	var height = $.CanvasBounds.Height / this.Rows;

	var x = Math.floor(mX / width);
	var y = Math.floor(mY / height);

	this.MoveTile(x, y);
};

$.ShuffleGame.prototype.MoveTile = function (moveToCol, moveToRow) {
	var moveTile = this.Tiles[moveToCol][moveToRow];
	if (!moveTile) { return false; } // No tile

	var possibleMoves = [];
	possibleMoves.push(this.GetTile(moveToCol - 1, moveToRow));
	possibleMoves.push(this.GetTile(moveToCol + 1, moveToRow));
	possibleMoves.push(this.GetTile(moveToCol, moveToRow - 1));
	possibleMoves.push(this.GetTile(moveToCol, moveToRow + 1));

	for (var t = 0; t < possibleMoves.length; t++) {
		if (possibleMoves[t] && possibleMoves[t].IsBlank) {
			var toTile = possibleMoves[t];
			var copy = {};
			copy.IsBlank = toTile.IsBlank;
			//copy.Col = toTile.Col;
			//copy.Row = toTile.Row;
			copy.CurrentIndex = toTile.CurrentIndex;
			copy.Bounds = toTile.Bounds;

			toTile.IsBlank = false;
			//toTile.Col = moveTile.Col;
			//toTile.Row = moveTile.Row;
			toTile.CurrentIndex = moveTile.CurrentIndex;
			toTile.Bounds.Copy(moveTile.Bounds);

			moveTile.IsBlank = true;
			//moveTile.Col = copy.Col;
			//moveTile.Row = copy.Row;
			moveTile.CurrentIndex = copy.CurrentIndex;
			moveTile.Bounds.Copy(copy.Bounds);

			break;
		}
	}
};

$.ShuffleGame.prototype.GetTile = function (tileCol, tileRow) {
	if ($.GridContainsTile(tileCol, tileRow, this.Cols, this.Rows)) {
		return this.Tiles[tileCol][tileRow];
	}

	return null;
};

$.ShuffleGame.prototype.PositionByIndex = function (originalIndex) {
	var index = 0;
	for (var col = 0; col < this.Cols; col++) {
		for (var row = 0; row < this.Rows; row++) {
			index++;
			if (index === originalIndex) {
				return new $.Point(col, row);
			}
		}
	}

	return null;
};

$.ShuffleGame.prototype.Update = function () {
	var width = $.CanvasBounds.Width / this.Cols;
	var height = $.CanvasBounds.Height / this.Rows;

	for (var col = 0; col < this.Cols; col++) {
		for (var row = 0; row < this.Rows; row++) {
			this.Tiles[col][row].Bounds.X = col * width;
			this.Tiles[col][row].Bounds.Y = row * height;
			this.Tiles[col][row].Bounds.Width = width;
			this.Tiles[col][row].Bounds.Height = height;
		}
	}
};

$.ShuffleGame.prototype.Draw = function () {
	$.Gtx.clearRect(0, 0, $.CanvasBounds.Width, $.CanvasBounds.Height);

	for (var col = 0; col < this.Cols; col++) {
		for (var row = 0; row < this.Rows; row++) {

			if (this.Tiles[col][row].IsBlank) { continue; }

			var bounds = this.Tiles[col][row].Bounds;
			var position = this.PositionByIndex(this.Tiles[col][row].CurrentIndex);

			$.Gtx.drawImage(
				$.ImageOne,
				position.X * this.TileWidth,
				position.Y * this.TileHeight,
				this.TileWidth,
				this.TileHeight,
				bounds.X,
				bounds.Y,
				bounds.Width,
				bounds.Height);

			$.Gtx.strokeStyle = "white";
			$.Gtx.beginPath();
			$.Gtx.rect(								
				bounds.X,
				bounds.Y,
				bounds.Width,
				bounds.Height);
			$.Gtx.stroke();
		}
	}
};