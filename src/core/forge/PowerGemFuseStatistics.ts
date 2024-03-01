class PowerGemFuseStatistics {

    roleName?: string;

    m10: number = 0;
    m9: number = 0;
    m8: number = 0;
    m7: number = 0;
    m6: number = 0;
    m5: number = 0;
    m4: number = 0;
    m3: number = 0;
    m2: number = 0;
    m1: number = 0;
    z: number = 0;
    p1: number = 0;
    p2: number = 0;
    p3: number = 0;
    p4: number = 0;
    p5: number = 0;
    p6: number = 0;
    p7: number = 0;
    p8: number = 0;
    p9: number = 0;
    p10: number = 0;
    p11: number = 0;
    p12: number = 0;
    p13: number = 0;
    p14: number = 0;
    p15: number = 0;
    p16: number = 0;
    p17: number = 0;
    p18: number = 0;
    p19: number = 0;
    p20: number = 0;

    count: number = 0;
    totalEffort: number = 0;

    increase(e: number) {
        this.count++;
        this.totalEffort += e;

        if (e === -10) {
            this.m10++;
        } else if (e === -9) {
            this.m9++;
        } else if (e === -8) {
            this.m8++;
        } else if (e === -7) {
            this.m7++;
        } else if (e === -6) {
            this.m6++;
        } else if (e === -5) {
            this.m5++;
        } else if (e === -4) {
            this.m4++;
        } else if (e === -3) {
            this.m3++;
        } else if (e === -2) {
            this.m2++;
        } else if (e === -1) {
            this.m1++;
        } else if (e === 0) {
            this.z++;
        } else if (e === 1) {
            this.p1++;
        } else if (e === 2) {
            this.p2++;
        } else if (e === 3) {
            this.p3++;
        } else if (e === 4) {
            this.p4++;
        } else if (e === 5) {
            this.p5++;
        } else if (e === 6) {
            this.p6++;
        } else if (e === 7) {
            this.p7++;
        } else if (e === 8) {
            this.p8++;
        } else if (e === 9) {
            this.p9++;
        } else if (e === 10) {
            this.p10++;
        } else if (e === 11) {
            this.p11++;
        } else if (e === 12) {
            this.p12++;
        } else if (e === 13) {
            this.p13++;
        } else if (e === 14) {
            this.p14++;
        } else if (e === 15) {
            this.p15++;
        } else if (e === 16) {
            this.p16++;
        } else if (e === 17) {
            this.p17++;
        } else if (e === 18) {
            this.p18++;
        } else if (e === 19) {
            this.p19++;
        } else if (e === 20) {
            this.p20++;
        }
    }

    average() {
        if (this.count === 0) {
            return "0";
        }
        return (this.totalEffort / this.count).toFixed(2);
    }
}

export = PowerGemFuseStatistics;