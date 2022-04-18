import React from "react";

interface NavbarProps {
    pageActive: "viz" | "group" | "impute";
    setPageActive: Function;
}

class Navbar extends React.Component<NavbarProps,{}> {
    constructor(props: NavbarProps) {
        super(props);
    }

    render() {
        return (
            <div className="navbar">
                <div className={(this.props.pageActive=="viz")?"selected":""} onClick={()=>this.props.setPageActive("viz")}>
                Visualize
                </div>
                <div className={(this.props.pageActive=="group")?"selected":""} onClick={()=>this.props.setPageActive("group")}>
                Group
                </div>
                <div className={(this.props.pageActive=="impute")?"selected":""} onClick={()=>this.props.setPageActive("impute")}>
                Impute
                </div>

            </div>
        )
    }
}

export default Navbar;