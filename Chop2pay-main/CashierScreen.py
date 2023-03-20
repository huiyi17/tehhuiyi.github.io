import kivy
kivy.require('1.10.0')
from kivymd.app import MDApp
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen
from kivymd.uix.card import MDCard
from kivy.properties import StringProperty
from process import getItemList
import asyncio
import pandas as pd
from kivy.app import async_runTouchApp
# Create both screens. Please note the root.manager.current: this is how
# you can control the ScreenManager from kv. Each screen has by default a
# property manager that gives you the instance of the ScreenManager used.
Builder.load_string("""

<MD3Card>
    padding: 4
    size_hint: None, None
    


    MDRelativeLayout:

       

        MDLabel:
            id: label
            text: root.text
            adaptive_size: True
            color: "black"
            pos: "12dp", "12dp"
            bold: True
<MenuScreen>:
    BoxLayout:
        Button:
            
            on_press: root.loadRequest()
            background_normal: ''
            background_color:"cadetblue"
            
            
            Image:
                center_x: self.parent.center_x
                center_y: self.parent.center_y
                source:'images/conveyer.png'
            MDLabel:
                adaptive_size: True
                center_x: self.parent.center_x
                center_y: self.parent.center_y+80
                text: "CHOP2PAY"
                color: "black"
                font_size:50
                bold: True
                font_name:"fonts/Righteous-Regular"
                
                    
            MDLabel:
                adaptive_size: True
                center_x: self.parent.center_x
                center_y: self.parent.center_y-80
                text: "tap anywhere to start!"
                color: "black"
                    
                bold: True

<PaymentScreen>:
    BoxLayout:
        Button:
            
            on_press: root.manager.current = 'nets'
            background_normal: ''
            background_color:"cadetblue"
            Image:
                center_x: self.parent.center_x-10
                center_y: self.parent.center_y
                source:'images/netspay.png'
        Button:
            
            on_press: root.manager.current = 'visa'
            background_normal: ''
            background_color:"cadetblue"       
            Image:
                center_x: self.parent.center_x
                center_y: self.parent.center_y
                source:'images/visa3.png'
        Button:
            
            on_press: root.manager.current = 'cash'
            background_normal: ''
            background_color:"cadetblue"
            Image:
                center_x: self.parent.center_x+10
                center_y: self.parent.center_y
                source:'images/cash6.png'

<LoadingScreen>:
    background_normal: ''
    background_color:"cadetblue"
    
    MDLabel:
                
        size_hint:(1.0,0.5)
        adaptive_size: True
        center_x: self.parent.center_x
        center_y: self.parent.center_y-80
        text: "processing..."
        color: "black"
        font_size:18
        bold: True
        font_name:"fonts/SecularOne-Regular"

<NetsScreen>:
    BoxLayout:
        Button:
            on_press: root.manager.current = 'payment'
            background_normal: ''
            background_color:"cadetblue"
            Image:
                center_x: self.parent.center_x
                center_y: self.parent.center_y
                source:'images/netsqrcode.png'
                size: self.texture_size

<VisaScreen>:
    BoxLayout:
        Button:
            on_press: root.manager.current = 'payment'  
            background_normal: ''
            background_color:"cadetblue"
            
            MDLabel:
                        
                size_hint:(1.0,0.5)
                adaptive_size: True
                center_x: self.parent.center_x
                center_y: self.parent.center_y
                text: "Please proceed with your visa card for payment."
                color: "black"
                font_size:20
                bold: True
                font_name:"fonts/SecularOne-Regular"

<CashScreen>:
    BoxLayout:
        Button:
            on_press: root.manager.current = 'payment'
            background_normal: ''
            background_color:"cadetblue"
        
            MDLabel:
                        
                size_hint:(1.0,0.5)
                adaptive_size: True
                center_x: self.parent.center_x
                center_y: self.parent.center_y
                text: "Please input your cash into our machine's deposit area for payment."
                color: "black"
                font_size:20
                bold: True
                font_name:"fonts/SecularOne-Regular"

<BillScreen>:
    BoxLayout:
        size_hint:(1.0,1.0)
        
        orientation:'horizontal'
        ScrollView:
            id:scroll
            do_scroll_x: False
            do_scroll_y: True
            size_hint:(0.6,1.0)
            
            GridLayout:
                cols:1
                
                size_hint_y:None
                height:self.minimum_height
                
 
            
        GridLayout:
            cols:1
            size_hint:(0.4,1.0)
            MDLabel:
                id:total
                size_hint:(1.0,0.5)
                adaptive_size: True
                center_x: self.parent.center_x
                center_y: self.parent.center_y+80
                
                color: "black"
                font_size:30
                bold: True
                font_name:"fonts/SecularOne-Regular"
                
            Button:
                size_hint:(1.0,0.5)
                background_normal: ''
                background_color:"cadetblue"
                on_press: root.manager.current = 'payment'
                MDLabel:
                    adaptive_size: True
                    center_x: self.parent.center_x
                    center_y: self.parent.center_y
                    text: "pay"
                    color: "black"
                    font_size:30
                    bold: True
                    font_name:"fonts/SecularOne-Regular"
                Image:
                    center_x: self.parent.center_x+80
                    center_y: self.parent.center_y
                    source:'images/pay.png'
                
                
      

""")

async def loading():
    
    
    BillScreen.itemSet= await getItemList()
    
    
    
    


# Declare both screens
class MenuScreen(Screen):
    def loadRequest(self):
        sm.current="loading"
        
        
        #sm.current="bill"


class MD3Card(MDCard):
    '''Implements a material design v3 card.'''
    text = StringProperty()
class BillScreen(Screen):
    itemSet=set()
    total=0
    def on_enter(self):
        pricesDf=pd.read_excel('prices.xlsx')
        
        print(self.itemSet)
        for itemName in self.itemSet:
        
            price=pricesDf.loc[pricesDf["ITEM"]==itemName]["PRICE"].item()
            self.total+=price
            self.ids.scroll.children[0].add_widget(MD3Card(
                        size_hint=(1.0,None),
                        height="100dp",
                        line_color=(0.2, 0.2, 0.2, 0.8),
                        style='filled',
                        text=itemName +'\n $'+ str(price),
                        md_bg_color="mintcream",
                        shadow_softness=12,
                        shadow_offset=(0, 2),
                    ))
        self.ids.total.text="Total: $"+str(round(self.total,2))
        
        
class PaymentScreen(Screen):
    pass
 
class LoadingScreen(Screen):
    def on_enter(self):
        asyncio.run(loading())
        sm.current="bill"

class NetsScreen(Screen):
    pass 

class VisaScreen(Screen):
    pass 

class CashScreen(Screen):
    pass

class TestApp(MDApp):

    def build(self):
        # Create the screen manager
        global sm
        sm = ScreenManager()
        sm.add_widget(MenuScreen(name='menu'))
        sm.add_widget(BillScreen(name='bill'))
        sm.add_widget(PaymentScreen(name='payment'))
        sm.add_widget(LoadingScreen(name='loading'))
        sm.add_widget(NetsScreen(name='nets'))
        sm.add_widget(VisaScreen(name='visa'))
        sm.add_widget(CashScreen(name='cash'))
        return sm




if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(
    async_runTouchApp(TestApp().run(), async_lib='asyncio'))
    loop.close()
    
