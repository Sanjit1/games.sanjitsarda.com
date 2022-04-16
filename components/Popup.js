import { useState, Component } from "react";
import styles from "./styles/Popup.module.css";

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    xOut = () => {
        this.setState({ visible: false });
    };

    open = () => {
        this.setState({ visible: true });
    };

    render() {
        return this.state.visible ? (
            <div className={[styles.popupContainer]}>
                <button className={styles.close} onClick={this.xOut}>
                    X
                </button>
                <div className={styles.child}>{this.props.children}</div>
            </div>
        ) : (
            <></>
        );
    }
}

export default Popup;
