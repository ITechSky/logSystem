<template>
    <div class="panel-main-content">
        <div class="add-log">
            <div class="add-title">
                <div class="add-date">
                    {{nowDate|date}}
                </div>
                <div class="add-bts">
                    <button @click="insert()">完成</button>
                    <button @click="cancel()">取消</button>
                </div>
            </div>
            <div class="editor">
                <textarea id="editor" autofocus></textarea>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import dairyService from '../services/dairy'
    export default{
        ready(){
            //给“添加”按钮绑定hover事件更换背景图
            $('img[title="add"]').attr('src', '../imgs/add_select.png').unbind('hover').hover(function () {
                $(this).attr('src', '../imgs/add_hover.png');
            }, function () {
                $(this).attr('src', '../imgs/add_select.png');
            });
            dairyService.getToken(this, (token)=> {
                this.token = token;
                //在拿到token后，富文本编辑器初始化
                var editor = new Simditor({
                    textarea: $('#editor'),
                    placeholder: "请输入日志内容。。。",
                    toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale',
                        'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr',
                        'indent', 'outdent', 'alignment'
                    ],
                    defaultImage: '../imgs/userimg.png',
                    upload: {
                        url: 'http://up.qiniu.com/', //文件上传的接口地址
                        params: {token: this.token}, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                        fileKey: 'file', //服务器端获取文件数据的参数名
                        connectionCount: 3,
                        leaveConfirm: '正在上传文件'
                    }
                });
            });
            //为了避免主机上的时间不准，获取服务器的时间（今日零点）来判断是否有今天的日志
            dairyService.insertDairy(this, this.$route.params.userId, ()=> {

                swal(
                        '温馨提示',
                        '今天你已经写了日志，不可以重复写，直接修改就可以喽',
                        'warning'
                );

                $('img[title="add"]').attr('src', '../imgs/add.png').unbind('hover').hover(function () {
                    $(this).attr('src', '../imgs/add_hover.png');
                }, function () {
                    $(this).attr('src', '../imgs/add.png');
                });
                $('.js-add').removeClass('log-options-active');
                this.$router.go({name: 'user', params: {userId: this.$route.params.userId}});
            });
            //为了避免主机上的时间不准，获取服务器的时间
            dairyService.getNowTime(this, (data)=> {
                this.nowDate = data;
            });
        },
        data(){
            return {
                nowDate: '',
                token: ''
            }
        },
        methods: {
            //添加日志
            insert(){
                if (document.getElementById('editor').value) {
                    let dairyObj = {
                        user_id: this.$route.params.userId,
                        content: document.getElementById('editor').value
                    };
                    dairyService.insert(this, dairyObj, ()=> {
                        this.$router.go({name: 'user', params: {userId: this.$route.params.userId}});
                        $('.js-add').removeClass('log-options-active');
                        $('img[title="add"]').attr('src', '../imgs/add.png').unbind('hover').hover(function () {
                            $(this).attr('src', '../imgs/add_hover.png');
                        }, function () {
                            $(this).attr('src', '../imgs/add.png');
                        });
                    });
                } else {
                    swal(
                            '温馨提示',
                            '输入的内容不可以为空哦',
                            'warning'
                    );
                }
            },
            cancel(){
                this.$router.go({name: 'user', params: {userId: this.$route.params.userId}});
                $('.js-add').removeClass('log-options-active');
                $('img[title="add"]').attr('src', '../imgs/add.png').unbind('hover').hover(function () {
                    $(this).attr('src', '../imgs/add_hover.png');
                }, function () {
                    $(this).attr('src', '../imgs/add.png');
                });
            }
        }
    }
</script>
<style>
    @import "../css/dairy.css";
</style>