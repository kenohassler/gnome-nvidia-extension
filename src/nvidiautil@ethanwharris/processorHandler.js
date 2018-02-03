/*This file is part of Nvidia Util Gnome Extension.

Nvidia Util Gnome Extension is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Nvidia Util Gnome Extension is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Nvidia Util Gnome Extension.  If not, see <http://www.gnu.org/licenses/>.*/

const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Shell = imports.gi.Shell;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ShellMountOperation = imports.ui.shellMountOperation;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Processor = Me.imports.processor;

const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

var ProcessorHandler = new Lang.Class({
  Name : 'ProcessorHandler',
  _init : function() {
    this._processors = [false, false];
  },
  process : function() {
    for (var i = 0; i < this._processors.length; i++) {
      if (this._processors[i]) {
        try {
          this._processors[i].process();
        } catch (err) {
          Main.notifyError("Error parsing " + this._processors[i].getName(), err.message);
          this._processors[i] = false;
        }
      }
    }
  },
  addProperty : function(property, listeners) {
    var processor = property.declare();
    if (!this._processors[processor]) {
      this._processors[processor] = new Processor.LIST[processor]();
    }

    this._processors[processor].addProperty(function(lines) {
      let values = property.parse(lines);
      for(var i = 0; i < values.length; i++) {
        listeners[i].handle(values[i]);
      }
    }, property.getCallExtension());
  },
  reset : function() {
    this._processors = [false, false];
  }
});
