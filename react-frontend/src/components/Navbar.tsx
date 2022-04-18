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
            <div>

            </div>
        )
    }
}

class NavbarItem extends React.Component<{isSelected: boolean},{}> {
    constructor(props: {isSelected: boolean}) {
        super(props);
    }

    render() {
        return (
            <div className="NavbarItem">
            </div>
        )
    }
}

export default Navbar;