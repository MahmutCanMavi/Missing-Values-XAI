export function groupcolor(id: number | null) {
    if (id == null) {
        return "#fff";
    }
    else {
        const colors = ["#07c4b2", "#6f5ed3", "#ce3665", "#ffcd1c", "#3896e3", "#db61db", "#929a9b", "#59cb59", "#fc8943", "#db3e3e"];
        return colors[id % 10];
    }
}
 