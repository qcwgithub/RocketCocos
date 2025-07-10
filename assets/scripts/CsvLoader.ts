export class CsvLoader {
    lines: string[];
    lineIndex: number;
    header: Map<string, number>;
    public load(text: string): void {
        this.lines = text.split(/\r?\n/);
        for (let i = 0; i < this.lines.length; i++) {
            let line: string = this.lines[i];
            if (line.length == 0 || line.startsWith('#')) {
                continue;
            }

            let cells: string[] = line.split(',');

            this.header = new Map<string, number>();
            for (let j = 0; j < cells.length; j++) {
                this.header.set(cells[j], j);
            }

            this.lineIndex = i + 1;
            return;
        }
    }

    cells: string[];
    public readRow(): boolean {
        for (; this.lineIndex < this.lines.length; this.lineIndex++) {
            let line: string = this.lines[this.lineIndex];
            if (line.length == 0 || line.startsWith('#')) {
                continue;
            }

            this.cells = line.split(',');
            this.lineIndex++;
            return true;
        }

        return false;
    }

    public readInt(key: string): number {
        let index = this.header.get(key);
        return parseInt(this.cells[index]);
    }

    public readString(key: string): string {
        let index = this.header.get(key);
        return this.cells[index];
    }
}