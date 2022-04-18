import React from "react";

interface NavbarProps {
    pageActive: "viz" | "group" | "impute";
}

class Navbar extends React.Component<NavbarProps,{}> {
    constructor(props: NavbarProps) {
        super(props);
    }

    render() {
        return (
            <div className="navbar">
                <div className={(this.props.pageActive=="viz")?"selected":""}>
                Vizualize
                </div>
                <div className={(this.props.pageActive=="group")?"selected":""}>
                Group
                </div>
                <div className={(this.props.pageActive=="impute")?"selected":""}>
                Impute
                </div>

            </div>
        )
    }
}

export default Navbar;