var Main = {
    data() {
        return {
            tableData: [
                {
                    id: "111",
                    name: "王小虎1",
                    amount1: "234",
                    amount2: "3.2",
                    amount3: 10,
                },
                {
                    id: "111",
                    name: "王小虎1",
                    amount1: "165",
                    amount2: "4.43",
                    amount3: 12,
                },
                {
                    id: "222",
                    name: "王小虎2",
                    amount1: "324",
                    amount2: "1.9",
                    amount3: 9,
                },
                {
                    id: "222",
                    name: "王小虎2",
                    amount1: "621",
                    amount2: "2.2",
                    amount3: 17,
                },
                {
                    id: "333",
                    name: "王小虎3",
                    amount1: "539",
                    amount2: "4.1",
                    amount3: 15,
                },
            ],
        };
    },
    methods: {
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const currentId = row.id;
                // Only check previous rows for same id
                if (rowIndex === 0 || this.tableData[rowIndex - 1].id !== currentId) {
                    // Count how many consecutive rows have the same id
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < this.tableData.length; i++) {
                        if (this.tableData[i].id === currentId) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
    },
};
var Ctor = Vue.extend(Main);
new Ctor().$mount("#app");
