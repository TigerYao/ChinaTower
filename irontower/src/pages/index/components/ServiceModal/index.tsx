import React from 'react';
import ReactDOM from 'react-dom';
import SelectModal from './modal';

export default {
  show(options = {}) {
    // const { version, tips, downloadUrl, show, isForceUpgrade = false } = options;
    const div = document.createElement('div');
    div.id = 'tieTUpdate-div';
    div.onclick=(()=>{this.hidden()})
    document.body.appendChild(div);
    const element = (
      <SelectModal
        {...options}
        onClose={() => {
          this.hidden();
        }}
      />
    );
    ReactDOM.render(element, div);
    // document.addEventListener('backbutton', this.hidden, false);
  },
  hidden() {
    const div = document.getElementById('tieTUpdate-div');
    if (div) {
      document.body.removeChild(div);
    }
  },
};
