/**
 * Created by 刘娟娟 on 2016/7/6.
 */
'use strict';
const Dairy = require('../models/dairy');
//client
exports.insert=(req,res)=>{
    let dairyObj=new Dairy(req.body);
    dairyObj.save((err,data)=>{
        if(err){
            res.json({code:555,data:err});
        }else{
            res.json({code:200,data:data});
        }
    })
};
exports.findByUser=(req,res)=>{
    Dairy.find({user_id:req.params.userId})
    .sort({create_date:-1})
    .exec((err,data)=>{
        if(err){
            res.json({code:555,data:err})
        }else{
            res.json({code:200,data:data})
        }
    })
};
exports.isInsert=(req,res)=>{
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    Dairy.count({user_id:req.params.userId,create_date:{$gt:today}},(err,data)=>{
        if(err){
            res.json({code:555,data:err})
        }else{
            if(data>0){
                res.json({code:201,data:data})
            }else{
                res.json({code:200,data:data})
            }
        }
    })
};
exports.update=(req,res)=>{
    let obj={content:req.body.content,last_update:new Date()};
    Dairy.update({_id:req.body._id},{$set:obj},function(err,data){
        if(err){
            res.json({code:555,data:err});
        }else{
            res.json({code:200,data:data});
        }
    })
};
exports.findByDate=(req,res)=>{
      let dateSeconds=new Date(req.body.selectDate).getTime()+24*60*60*1000;
      Dairy
        .find({user_id:req.body.userId,create_date:{$lte:new Date(dateSeconds)}})
        .sort({create_date:-1})
        .limit(10)
        .exec((err,data)=>{
            if(err){
                res.json({code:555,data:err})
            }else{
                res.json({code:200,data:data});
            }
        })
};
exports.getNowTime=(req,res)=>{
    res.json({code:200,data:new Date()});
};
//manager
exports.findDairyByUser=(req,res)=>{
    let per_page=req.body.per_page;
    let current_page=req.body.current_page;
    let query={user_id:req.body.userId};
    Dairy.find(query)
    .sort({create_date:-1})
    .skip(per_page*(current_page-1))
    .limit(per_page)
    .exec((err,data)=>{
        if(err){
            res.json({code:555,data:err})
        }else{
            Dairy.count(query,(err,sum)=>{
                if(err){
                    res.json({code:555,data:err})
                }else{
                    res.json({code:200,data:data,sum:sum})
                }
            })
        }
    })
};