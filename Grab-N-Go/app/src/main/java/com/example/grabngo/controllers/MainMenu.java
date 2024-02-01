package com.example.grabngo.controllers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.ImageView;

import com.example.grabngo.R;

/** Function: For users to choose signing in or registering as new user
 *  Input: None (setContentView to layout/activity_main_menu.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: MainActivity.java
 *  Next Page Link: ChooseOne.java
 *  Java Concepts/OOP: Intent
 */

public class MainMenu extends AppCompatActivity {

    Button signinwithemail_btn,signup_btn;
    ImageView bgimage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_menu);

        final Animation zoomin = AnimationUtils.loadAnimation(this,R.anim.zoomin);
        final Animation zoomout = AnimationUtils.loadAnimation(this,R.anim.zoomout);
        //to add background animation
        //need to create some custom zoomin, zoomout, move .xmla in
        //"anim" resource dir in "res" file
        bgimage = findViewById(R.id.back2);
        bgimage.setAnimation(zoomin);
        bgimage.setAnimation(zoomout);

        zoomout.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationStart(Animation animation) {


            }

            @Override
            public void onAnimationEnd(Animation animation) {
                bgimage.startAnimation(zoomin);

            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });

        zoomin.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
                bgimage.startAnimation(zoomout);

            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });
        signinwithemail_btn=(Button)findViewById(R.id.signwithemailbtn);
        signup_btn=(Button)findViewById(R.id.signupbtn);

        signinwithemail_btn.setOnClickListener((new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent signinwithemail = new Intent(MainMenu.this, ChooseOne.class);
                signinwithemail.putExtra("Home","Email");
                startActivity(signinwithemail);
                finish();

            }
        }));
        signup_btn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                Intent signup = new Intent(MainMenu.this, ChooseOne.class);
                signup.putExtra("Home","SignUp");
                startActivity(signup);
                finish();
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        System.gc();
    }
}