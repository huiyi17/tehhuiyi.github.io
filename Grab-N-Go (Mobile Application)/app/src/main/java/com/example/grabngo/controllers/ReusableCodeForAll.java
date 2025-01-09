package com.example.grabngo.controllers;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

/** Function: For displaying of dialog boxes (alerts)
 *  Input: None
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: None
 *  Next Page Link: None
 *  Java Concepts/OOP: None
 */
public class ReusableCodeForAll {

    public static void ShowAlert(Context context,String title,String message)
    {
        AlertDialog.Builder builder=new AlertDialog.Builder(context);
        builder.setCancelable(false);
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                dialog.dismiss();
            }
        }).setTitle(title).setMessage(message).show();
    }
}

