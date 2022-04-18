import React from "react";
import { default as BootstrapNavbar } from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

interface NavbarProps {
    pageActive: "viz" | "group" | "impute";
}

class Navbars extends React.Component<NavbarProps,{}> {
    constructor(props: NavbarProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <BootstrapNavbar bg="dark" variant="dark">
                    <Container>
                        <BootstrapNavbar.Brand href="#home">Missing Data Explorer</BootstrapNavbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="#viz">Visualize</Nav.Link>
                            <Nav.Link href="#group">Group Features</Nav.Link>
                            <Nav.Link href="#impute">Impute</Nav.Link>
                        </Nav>
                    </Container>
                </BootstrapNavbar>
            </div>
        )
    }
}

export default Navbar;