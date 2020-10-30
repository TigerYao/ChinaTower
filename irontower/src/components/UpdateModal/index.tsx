import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './modal';

export default {
  show(options = {}) {
    // const { version, tips, downloadUrl, show, isForceUpgrade = false } = options;
    const div = document.createElement('div');
    div.id = 'tieTUpdate-div';
    document.body.appendChild(div);
    const element = (
      <Modal
        {...options}
        onClose={() => {
          this.hidden();
        }}
      />
    );
    ReactDOM.render(element, div);
  },
  hidden() {
    const div = document.getElementById('tieTUpdate-div');
    if (div) {
      document.body.removeChild(div);
    }
  },
};
